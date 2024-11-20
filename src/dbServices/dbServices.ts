import { openDB } from 'idb';

class LocalDb {
    static async loadLocalDB(dbName: string, storeName: any, version: number) {
        // const db = openDB('hoolva', version, {
        const db = openDB(dbName, version, {
            upgrade(db) {
                db.createObjectStore(storeName);
            },

        });
        return db;
    }

    static async set(db: any, storeName: any, key: any, data: any) {
        (await db).put(storeName, data, key);
    }

    static async get(db: any, storeName: any, key: any, callBack: any) {
        (await db).get(storeName, key)
            .then((response: any) => {
                callBack(
                    {
                        status: 'success',
                        response
                    }
                );
            })
            .catch((error: any) => {
                callBack({
                    status: 'error',
                    error: error
                })
                
            })

    }

    static async getAllKeys(db: any, storeName: any, callBack: any) {
        (await db).getAllKeys(storeName)
            .then((response: any) => {
                callBack(
                    {
                        status: 'success',
                        response
                    }
                );
            })
            .catch((error: any) => {
                // callBack({
                //     status: 'error',
                //     error: error
                // })
                
            })

    }

    // static async del(db: any, key: any) {
    //     (await db).delete('hoolva', key)
    // }

    static async clear(db: any, storeName: any) {
        (await db).clear(storeName);
    }
    static async del(db: any, storeName: any, key: any) {
        (await db).delete(storeName, key);
    }
}

export default LocalDb;


