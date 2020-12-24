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