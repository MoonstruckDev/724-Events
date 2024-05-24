import PropTypes from "prop-types"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

const DataContext = createContext({})

export const api = {
    loadData: async () => {
        const json = await fetch("/events.json")
        return json.json()
    },
}

export const DataProvider = ({ children }) => {
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    const getData = useCallback(async () => {
        try {
            setData(await api.loadData())
        } catch (err) {
            setError(err)
        }
    }, [])
    useEffect(() => {
        if (data) return
        getData()
    })

    // Calcul de l'événement plus récent grâce à la methode reduce()
    // qui va parcours tout le tableau des events pour trouver le dernier événement en termes de date
    // La valeur obetenu on va l'assigner au props qui nétait pas définie jusqu'à présent
    const lastEvent =
        data && data.events
            ? data.events.reduce((acc, event) => {
                  if (!acc || new Date(event.date) > new Date(acc.date)) {
                      return event
                  }
                  return acc
              }, null)
            : null

    return (
        <DataContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                data,
                error,
                // Ajouter la props "last" avec la valeur de la variable "lastEvent"
                last: lastEvent
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext)

export default DataContext