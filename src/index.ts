export default class DBSure {
    public name: string
    public version: number
    public schemas: DBSURE.Schema[]
    public db: IDBDatabase

    constructor(name: string, version = 1, schemas: DBSURE.Schema[]) {
        this.name = name
        this.version = version
        this.schemas = schemas
    }

    public openDB(): Promise<IDBOpenDBRequest> {
        return new Promise((resolve, reject) => {
            const request: IDBOpenDBRequest = indexedDB.open(this.name, this.version)
            request.addEventListener('error', () => reject(request.error))
            request.addEventListener('success', () => {
                this.db = request.result
                this.db.addEventListener(`error`, reject)
                this.db.addEventListener(`close`, reject)
                resolve(request)
            })
            request.addEventListener('upgradeneeded', () => {
                this.db = request.result
                this.schemas.forEach(schema => createSchema(this.db, schema))
            })
        })
    }

    public async add<T = any>(name: string, items: T | T[]) {
        const { store } = await this.commit(name, 'readwrite')
        Array.isArray(items) ? items.map(item => store.add(item)) : store.add(items)
        return items
    }

    public async query<T = any>(name: string, query?: (item: T) => boolean): Promise<T[]> {
        const { items } = await this.commit(name, 'readwrite')
        return typeof query === 'function' ? items.filter(query) : items
    }

    public async update<T = any>(name: string, key: any, modify: (data: T) => void): Promise<IDBRequest> {
        const { store } = await this.commit(name, 'readwrite')
        const request = store.get(key)
        request.addEventListener('success', () => {
            const data = request.result
            modify(data)
            const update = store.put(data)
            // update.addEventListener('success', () => console.log(`updated`, data))
            update.addEventListener('error', (event) => console.error(`updated fail`, event))
        })
        return request
    }

    public async remove(name: string, key: IDBValidKey | IDBKeyRange): Promise<IDBRequest> {
        const { store } = await this.commit(name, 'readwrite')
        return store.delete(key)
    }

    public commit(name: string, mode: IDBTransactionMode) {
        return new Promise((resolve: (object: DBSURE.CommitResolve) => void, reject) => {
            if (!this.db) throw new Error(`db not opened.`);
            const store = this.db.transaction(name, mode).objectStore(name)
            const request = store.getAll()
            request.addEventListener('success', () => resolve({ store, items: request.result }))
            request.addEventListener('error', reject)
        })
    }

    public createStore(name: string): DBSURE.IStore {
        return {
            add: async <T = any>(items: T | T[]): Promise<T | T[]> => await this.add(name, items),
            query: async <T = any>(query?: (item: T) => boolean): Promise<T[]> => await this.query(name, query),
            update: async <T = any>(key: any, modify: (data: T) => void): Promise<IDBRequest> => await this.update(name, key, modify),
            remove: async (key: IDBValidKey | IDBKeyRange): Promise<IDBRequest> => this.remove(name, key),
        }
    }
}

function createSchema(db: IDBDatabase, schema: DBSURE.Schema) {
    if (!db.objectStoreNames.contains(schema.name)) {
        const store = db.createObjectStore(schema.name, schema.options)
        if (Array.isArray(schema.indexs)) {
            schema.indexs.forEach(({ key, options }) => store.createIndex(key, key, options))
        }
    }
}
