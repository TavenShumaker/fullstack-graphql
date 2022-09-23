import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    type
    name
    img
    vaccinated @client
    owner {
      id
    }
  }
`

const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`

const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(input: $newPet){
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`

export default function Pets () {
  const [modal, setModal] = useState(false);
  const {data, loading, error} = useQuery(ALL_PETS);

  const  [createPet, newPet] = useMutation(
    NEW_PET, {
    update(cache, { data: {addPet}}) {
      const {pets} = cache.readQuery({query: ALL_PETS});
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet, ...pets] }
      })
    }
    /**
     * You can place optimisticResponse right here, but it won't become optimistic until the response comes back
     */
    // optimisticResponse {}
  });


  const onSubmit = input => {
    setModal(false)
    createPet({
      variables: {
        "newPet": input
      },
      /**
       * The other reason that you would probably put the optimistic response down here is becasue you can use inputs to determine what
       * the optimistic response would look like
       * 
       * This optimistic response is actually being added to the apollo cache, and then when the real response comes back it will
       * replace what is in the cache. This can become a probleem if you don't clean up on errors. On error you will have to clean up
       * your optimistic response.
       */
      optimisticResponse: {
        __typename: 'Mutation',
        addPet: {
          __typename: 'Pet',
          id: '000000',
          type: input.type,
          name: input.name,
          img: 'https://via.placeholder.com/300',
          vaccinated: true,
          owner: {
            __typename: 'User',
            id: '000000'
          }
        }
      }
    })
  }

  /**
   * We don't need to show the loader because we opted into optimistic UI
   */
  if (loading || newPet.loading) {
    return <Loader />
  }

  if (error || newPet.error) {
    return <p>Error</p>
  }
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets}/>
      </section>
    </div>
  )
}
