import userModel from 'models/user';
import axios, { AxiosResponse } from 'axios';
import config from 'common/config';
import species, { Species } from 'common/data/species';

const BUTTERFLY_GROUP_ID = 4;
const MOTH_GROUP_ID = 8;

export type Result = {
  classifier_id: string;
  classifier_name: string;
  probability: number;
  group: number;
  taxon: string;
  authority: string;
  language_iso: string;
  preferred: string;
  preferred_taxon: string;
  preferred_authority: string;
  /**
   * @deprecated this comes from the server which might differ from the app ones
   */
  default_common_name: string; // not using this one
  taxa_taxon_list_id: string;
  taxon_meaning_id: string;
};

function getExtraInfo(sp: Result) {
  const speciesData = species;
  const byTaxonMeaningId = ({ taxonMeaningId }: Species) =>
    taxonMeaningId === parseInt(sp.taxon_meaning_id, 10);
  const taxon = speciesData.find(byTaxonMeaningId);

  if (!taxon) return {} as any;

  return {
    common_name: taxon.commonName,
    found_in_name: 'common_name',
    thumbnail: taxon.thumbnail,
    thumbnailBackground: taxon.thumbnailBackground,
    type: taxon.type,
  };
}

export default async function identify(url: string): Promise<Result[]> {
  const data = new URLSearchParams({ image: url });

  const params = new URLSearchParams({
    _api_proxy_uri: 'identify-proxy/v1/?app_name=uni-jena',
  });

  const options: any = {
    method: 'post',
    params,
    url: `${config.backend.url}/api-proxy/waarneming`,
    // url: 'https://butterfly-monitoring.net/api-proxy/waarneming',
    headers: {
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
    timeout: 80000,
  };

  const response: AxiosResponse<Result[]> = await axios(options);

  const withValidData = (sp: Result) => {
    const speciesData = species;

    // TODO: Some species has good probability score, but classifier results does not have taxon_meaning_id key? eg. ("Adonis Blue", "Cryptic wood white", "Char Hill blue").
    if (!sp.taxon_meaning_id) return null;

    const byTaxonMeaningId = ({ taxonMeaningId }: Species) =>
      taxonMeaningId === parseInt(sp.taxon_meaning_id, 10);
    const speciesIdMatches = speciesData.some(byTaxonMeaningId);

    if (!speciesIdMatches) return false;

    const hasMothOrButterflyGroup =
      sp.group === BUTTERFLY_GROUP_ID || sp.group === MOTH_GROUP_ID;
    if (!hasMothOrButterflyGroup && !sp.taxa_taxon_list_id && !sp.taxon)
      return false;

    return true;
  };

  const normalizeBaseValues = (sp: Result) => ({
    ...sp,
    warehouse_id: parseInt(sp.taxa_taxon_list_id, 10),
    scientific_name: sp.taxon,
    found_in_name: 'scientific_name',
  });

  const attachExtraInfo = (sp: Result) => ({ ...sp, ...getExtraInfo(sp) });
  const suggestions = response.data
    .filter(withValidData)
    .map(normalizeBaseValues)
    .map(attachExtraInfo);

  return suggestions;
}
