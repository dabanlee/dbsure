# README

A indexedDB wrapper.

## Install

```sh
$ yarn add dbsure
```

## Usage

```ts
import DB from 'dbsure'

const db = new DB('databaseName', 1, [{
    name: `storeName`,
    options: {
        keyPath: `name`,
    },
}])

const items = [{
    id: 0,
    name: 'DBL',
}, {
    id: 1,
    name: 'AAA',
}, {
    id: 2,
    name: 'BBB',
}]
// openDB
await db.openDB()
const store = db.createStore(`storeName`)
store.add(items)
store.query(item => item.name === 'DBL')
store.update('DBL', item => (item.name = 'dbl'))
store.remove('DBL')
```

## Api

**openDB**

`.openDB(): Promise<IDBOpenDBRequest>`

**Adding data to the database**

`.add<T = any>(name: string, items: T | T[])`

**Removing data from the database**

`.remove(name: string, key: string)`

**Getting data from the database**

`.query<T = any>(name: string, query: (item: T) => boolean): Promise<T[]>`

**Updating an entry in the database**

`.update<T = any>(name: string, key: string, modify: (data: T) => void)`

## License

Licensed under the [MIT License](https://github.com/dabanlee/dbsure/blob/master/LICENSE)