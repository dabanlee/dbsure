import DBSure from '../src'
import 'fake-indexeddb/auto'

function createDB() {
    return new DBSure('database-name', [{
        name: 'winners',
        options: {
            keyPath: 'name',
        },
    }])
}

type Winner = {
    id: number,
    name: string,
    score: number,
}

const winnerDBL: Winner = {
    id: 0,
    name: 'DBL',
    score: 100,
}

describe('DBSure', () => {
    it('should open the indexedDB', async () => {
        const dbsure = createDB()
        const { result } = await dbsure.openDB()

        expect(result).toBeInstanceOf(IDBDatabase)
    })

    it('should add and query the record correctly', async () => {
        const dbsure = createDB()
        await dbsure.openDB()
        const store: DBSURE.IStore = dbsure.createStore('winners')
        await store.add<Winner>(winnerDBL)
        const [winner] = await store.query(({ id }) => id === 0)

        expect(winner).toEqual(winnerDBL)
    })

    it('should remove record correctly', async () => {
        const dbsure = createDB()
        await dbsure.openDB()
        const store: DBSURE.IStore = dbsure.createStore('winners')
        await store.add<Winner>(winnerDBL)
        await store.remove('DBL')
        const winners = await store.query<Winner>()
        const [winner] = await store.query<Winner>(({ id }) => id === 0)

        expect(winners.length).toBe(0)
        expect(winner).toBe(undefined)
    })

    it('should update record correctly', async () => {
        const dbsure = createDB()
        await dbsure.openDB()
        const store: DBSURE.IStore = dbsure.createStore('winners')
        await store.add<Winner>(winnerDBL)
        await store.update<Winner>('DBL', item => {
            item.name = 'DDD'
        })
        const [winner] = await store.query<Winner>(({ id }) => id === 0)
        const winners = await store.query()
        console.log(winners)

        expect(winner.name).toBe('DDD')
    })
})
