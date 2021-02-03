```
h= ['webLink',
'mainMarkings',
'family',
'2ndMarkings',
'scientificName',
'ukStatus',
'idTips',
'northernIreland',
'idTips',
'mainColourGroup',
'orderByTaxonomy',
'england',
'wales',
'wingspan',
'orderByCommonName',
'group',
'appMenu',
'size',
'habitats',
'ukStatus2',
'2ndColourGroup',
'orderByScientificName',
'scotland',
'name',
'whenToSee',
'isleOfMan',
'id'];
a=[];s.forEach(sp => {
    t = '';
    h.forEach(h => {
      t+=`${sp[h].replace('\n','')}|`
    });
    a.push(t)
})
```
