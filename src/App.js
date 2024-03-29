import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { listNotes } from "./graphql/queries";
import { listListings } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import {
  createListing as createListingMutation,
  deleteListing as deleteListingMutation,
} from "./graphql/mutations"; 

import { API, Storage } from 'aws-amplify';
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useCallback, useRef } from 'react';
import { useMemo } from "react";



const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);
  const [listings, setListings] = useState([]);
  const gridRef = useRef();

  const pushMeClicked = useCallback ( e => {
    gridRef.current.api.deselectAll();
  });
  const [rowData, setRowData] = useState([   
  {make: 'Ford', model: 'Focus', price: 40000},
  {make: 'Toyota', model: 'Celica', price: 45000},
  {make: 'BMW', model: '4 Series', price: 50000}]);

  const [columnDefs, setColumnDefs] = useState([
    {field: 'make'},
    {field: 'model'},
    {field: 'price'}

  ]);

  const defaultColDef = useMemo( ()=> ({
    sortable: true,
    filter: true
    }), []);

  const cellClickedListener = useCallback(e => {
    console.log('cellClicked', e);
  });

  useEffect(() => {
    fetchNotes();
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }
  async function fetchListings() {
    const apiData = await API.graphql({ query: listListings });
    const listingsFromAPI = apiData.data.listListings.items;
    await Promise.all(
      listingsFromAPI.map(async (listing) => {
        if (listing.image) {
          const url = await Storage.get(listing.name);
          listing.image = url;
        }
        return listing;
      })
    );
    setListings(listingsFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
      tag: form.get("tag"),
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  async function createListing(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      accountID : form.get("accountID"),
      foodType: form.get("foodType"),
      description: form.get("description"),
      image: image.name,
      extraInfo: form.get("extraInfo"),
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createListingMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  async function deleteListing({ id, name }) {
    const newListings = listings.filter((listing) => listing.id !== id);
    setListings(newListings);
    await Storage.remove(name);
    await API.graphql({
      query: deleteListingMutation,
      variables: { input: { id } },
    });
  }


  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />         
          <TextField
            name="tag"
            placeholder="Note Tag"
            label="Note Tag"
            labelHidden
            variation="quiet"
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />


          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>

      </View>


      <View as="form" margin="3rem 0" onSubmit={createListing}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="AccountID"
            placeholder="Listing AccountID"
            label="Listing AccountID"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="FoodType"
            placeholder="Listing FoodType"
            label="Listing FoodType"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Listing Description"
            label="Listing Description"
            labelHidden
            variation="quiet"
            required
          />         
          <TextField
            name="ExtraInfo"
            placeholder="Listing ExtraInfo"
            label="Listing ExtraInfo"
            labelHidden
            variation="quiet"
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />


          <Button type="submit" variation="primary">
            Create Listing
          </Button>
        </Flex>

      </View>
      <Heading level={2}>Notes</Heading>
      <View margin="3rem 0">
      {notes.map((note) => (
  <Flex
    key={note.id || note.name}
    direction="row"
    justifyContent="center"
    alignItems="center"
  >

      <Text as="strong" fontWeight={700}>
      {note.name}
    </Text>
    <Text as="span">{note.description}</Text>
    <Text as="span">{note.tag}</Text>
    {note.image && (
      <Image
        src={note.image}
        alt={`visual aid for ${notes.name}`}
        style={{ width: 20 }}
      />
    )}

    <div className="ag-theme-alpine" style={{height: 500}}>
      <button onClick={pushMeClicked}>Push Me</button>
      <AgGridReact
      ref = {gridRef}
        onCellClicked={cellClickedListener}
        rowData = {rowData}
        columnDefs = {columnDefs}
        defaultColDef = {defaultColDef}
        rowSelection='multiple'
        animateRows={true}/>
    </div>
    <Button variation="link" onClick={() => deleteNote(note)}>
      Delete note
    </Button>

  </Flex>
))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);