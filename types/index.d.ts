declare namespace DBSURE {
    interface Index {
        key?: string,
        options?: IDBIndexParameters,
    }

    interface Schema {
        name: string,
        options?: IDBObjectStoreParameters,
        indexs?: Index[],
    }

    interface CommitResolve {
        items: any[],
        store: IDBObjectStore,
    }

    interface IStore {
        add<T>(items: T | T[]): Promise<T | T[]>,
        query<T>(query?: (item: T) => boolean): Promise<T[]>,
        update<T>(key: any, modify: (data: T) => void): Promise<IDBRequest>,
        remove(key: IDBValidKey | IDBKeyRange): Promise<IDBRequest>,
    }
}
