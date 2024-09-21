export const usersFixture = [
  {
    id: "id_1",
    name: "Anton",
  },
  {
    id: "id_2",
    name: "Egor",
  },
  {
    id: "id_3",
    name: "Aram",
  },
  {
    id: "id_4",
    name: "Dimon",
  },
  {
    id: "id_5",
    name: "Valera",
  },
];

export const columnsFixture = [
  {
    kind: "explicit",
    alias: "rating",
    name: "Rating",
    sortable: true,
  },
  {
    kind: "explicit",
    alias: "author",
    name: "Author",
    width: 100,
    sortable: true,
  },
  {
    kind: "attributed",
    cellType: "text",
    attributeId: 1,
    name: "Name",
    sortable: true,
  },
  {
    kind: "attributed",
    cellType: "text",
    attributeId: 2,
    name: "Descr",
  },
  {
    kind: "attributed",
    cellType: "date",
    attributeId: 3,
    name: "Date",
  },
  {
    kind: "attributed",
    cellType: "multiList",
    attributeId: 4,
    listId: 1,
    name: "Tags",
    sortable: true,
  },
];

export const rowsFixture = [
  {
    rowId: 1,
    explicit: {
      rating: 4,
      author: {
        id: "id_1",
        name: "Anton",
      },
    },
    attributed: {
      text: [
        {
          id: 100,
          attributeId: 1,
          value: "joe",
          etag: "etagXXX",
        },
        {
          id: 101,
          attributeId: 2,
          value: "pass",
          etag: "etagXXX",
        },
      ],
      date: [
        {
          id: 200,
          attributeId: 3,
          value: "2024-10-16T21:56:38",
          etag: "etagXXX",
        },
      ],
      multiList: [
        {
          id: 200,
          attributeId: 4,
          listItemId: 1,
          etag: "etagXXX",
        },
        {
          id: 201,
          attributeId: 4,
          listItemId: 2,
          etag: "etagXXX",
        },
      ],
    },
  },
  {
    rowId: 2,
    explicit: {
      rating: 5,
      author: {
        id: "id_3",
        name: "Aram",
      },
    },
    attributed: {
      text: [
        {
          id: 100,
          attributeId: 1,
          value: "joe2",
          etag: "etagXXX",
        },
        {
          id: 101,
          attributeId: 2,
          value: "satriani3",
          etag: "etagXXX",
        },
      ],
      date: [
        {
          id: 200,
          attributeId: 3,
          value: "2024-10-10T00:00:00",
          etag: "etagXXX",
        },
      ],
      multiList: [
        {
          id: 200,
          attributeId: 4,
          listItemId: 1,
          etag: "etagXXX",
        },
      ],
    },
  },
  {
    rowId: 3,
    explicit: {
      rating: null,
      author: null,
    },
    attributed: {
      text: [],
      date: [],
      multiList: [],
    },
  },
];

export const listsFixture = [
  {
    id: 1,
    name: "Tags dictionary",
  },
  {
    id: 2,
    name: "Mock items dictionary",
  },
];

export const listItemsFixture = [
  {
    listItemId: 1,
    item: "tag1",
    listId: 1,
  },
  {
    listItemId: 2,
    item: "tag2",
    listId: 1,
  },
  {
    listItemId: 3,
    item: "item1",
    listId: 2,
  },
  {
    listItemId: 4,
    item: "item2",
    listId: 2,
  },
];
