// Database utility that converts a firebase snap shot to an array of specified data type
export function convertSnaps<T>(results: { docs: any[] }) {
    return <T[]> results.docs.map((snap: { id: any; data: () => any }) => {
        return {
            id: snap.id,
            ...<any>snap.data()
        }
    })
}