/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($filter: ModelSubscriptionNoteFilterInput) {
    onCreateNote(filter: $filter) {
      id
      name
      description
      tag
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($filter: ModelSubscriptionNoteFilterInput) {
    onUpdateNote(filter: $filter) {
      id
      name
      description
      tag
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($filter: ModelSubscriptionNoteFilterInput) {
    onDeleteNote(filter: $filter) {
      id
      name
      description
      tag
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateListing = /* GraphQL */ `
  subscription OnCreateListing($filter: ModelSubscriptionListingFilterInput) {
    onCreateListing(filter: $filter) {
      listingID
      accountID
      foodType
      imageAddress
      description
      extraInfo
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateListing = /* GraphQL */ `
  subscription OnUpdateListing($filter: ModelSubscriptionListingFilterInput) {
    onUpdateListing(filter: $filter) {
      listingID
      accountID
      foodType
      imageAddress
      description
      extraInfo
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteListing = /* GraphQL */ `
  subscription OnDeleteListing($filter: ModelSubscriptionListingFilterInput) {
    onDeleteListing(filter: $filter) {
      listingID
      accountID
      foodType
      imageAddress
      description
      extraInfo
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
