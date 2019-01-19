import { FieldDefinition } from './ItemInspector';

export const Created: FieldDefinition = {
  ID: '25bed78c-4957-4165-998a-ca1b52f67497',
  Name: '__Created',
  Type: 'datetime',
  Shared: false,
  Unversioned: false,
};

export const CreatedBy: FieldDefinition = {
  ID: '5dd74568-4d4b-44c1-b513-0af5f4cda34f',
  Name: '__Created by',
  Type: 'Single-Line Text',
  Shared: false,
  Unversioned: false,
};

export const SortOrder: FieldDefinition = {
  ID: 'ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e',
  Name: '__Sortorder',
  Type: 'Single-Line Text',
  Shared: true,
  Unversioned: false,
};

export const FinalRenderings: FieldDefinition = {
  ID: '04bf00db-f5fb-41f7-8ab7-22408372a981',
  Name: '__Final Renderings',
  Type: 'Layout',
  Shared: false,
  Unversioned: false,
};

// Image Template Field Definitions

export const Image = {
  Icon: {
    ID: '06d5295c-ed2f-4a54-9bf2-26228d113318',
    Name: '__Icon',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  Blob: {
    ID: '40e50ed9-ba07-4702-992e-a912738d32dc',
    Name: 'Blob',
    Type: 'blob',
    Shared: true,
    Unversioned: false,
  },
  Extension: {
    ID: 'c06867fe-9a43-4c7d-b739-48780492d06f',
    Name: 'Extension',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  MimeType: {
    ID: '6f47a0a5-9c94-4b48-abeb-42d38def6054',
    Name: 'Mime Type',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  Size: {
    ID: '6954b7c7-2487-423f-8600-436cb3b6dc0e',
    Name: 'Size',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  Width: {
    ID: '22eac599-f13b-4607-a89d-c091763a467d',
    Name: 'Width',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  Height: {
    ID: 'de2ca9e4-c117-4c8a-a139-1ff4b199d15a',
    Name: 'Height',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  Dimensions: {
    ID: 'cb09946f-3218-4823-87d2-d5007c199a96',
    Name: 'Dimensions',
    Type: 'Single-Line Text',
    Shared: true,
    Unversioned: false,
  },
  Alt: {
    ID: '65885c44-8fcd-4a7f-94f1-ee63703fe193',
    Name: 'Alt',
    Type: 'Single-Line Text',
    Shared: false,
    Unversioned: false,
  },
};
