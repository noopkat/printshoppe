#Data?

With level-object:
```
ps-db {
  job~1: {
           email: 'suz@noopkat.com',
           files: ['thing:8903', 'thing:98989'],
           message: 'only the first file for 8903 please',
           status: 'pending|printing|done',
           printer: 'TAZ-1|TAZ-2|TAZ-3|TAZ-4'
         }
}
```
  
  
Without level-object:
```
ps-db {
  job~1~email: 'suz@noopkat.com',
  job~1~files: ['thing:8903', 'thing:98989'],
  job~1~message: 'only the first file for 8903 please',
  job~1~status: 'pending|printing|done',
  job~1~printer: 'TAZ-1|TAZ-2|TAZ-3|TAZ-4'
}
```