import {
  columnsFixture,
  listItemsFixture,
  listsFixture,
  rowsFixture,
  usersFixture,
} from "./db.fixtures";

const DB_NAME = "db";
const DB_VERSION = 1;

export function initDB() {
  let openRequest = indexedDB.open(DB_NAME, DB_VERSION);

  openRequest.onupgradeneeded = function () {
    // срабатывает, если на клиенте нет базы данных

    initObjectStores(openRequest);

    applyFixtures(openRequest);
  };

  openRequest.onerror = function () {
    alert("DB error");
    console.error("Error", openRequest.error);
    //   let deleteRequest = indexedDB.deleteDatabase(DB_NAME)
  };

  openRequest.onsuccess = function () {
    let db = openRequest.result;

    db.onversionchange = function () {
      db.close();
      alert("База данных устарела, пожалуйста, перезагрузите страницу.");
    };
  };

  openRequest.onblocked = function () {
    // это событие не должно срабатывать, если мы правильно обрабатываем onversionchange

    // это означает, что есть ещё одно открытое соединение с той же базой данных
    // и он не был закрыт после того, как для него сработал db.onversionchange
    alert("DB error: db blocked");
  };
}

export const fetchAllStoreData = <T>(
  storeName: string,
  cb: (val: T[]) => void
) => {
  let openRequest = indexedDB.open(DB_NAME, DB_VERSION);

  openRequest.onsuccess = function () {
    let db = openRequest.result;

    if (db.objectStoreNames.contains(storeName) === false) {
      console.error(`DB error! Хранилище "${storeName}" не найдено.`);

      return;
    }

    let transaction = db.transaction([storeName], "readwrite");

    let store = transaction.objectStore(storeName);

    const dbRequest = store.getAll();

    dbRequest.onsuccess = () => {
      cb(dbRequest.result);
    };
  };
};

export const postData = <T>(
  storeName: string,
  data: T,
  cb: (id: IDBValidKey) => void
) => {
  let openRequest = indexedDB.open(DB_NAME, DB_VERSION);

  openRequest.onsuccess = function () {
    let db = openRequest.result;

    if (db.objectStoreNames.contains(storeName) === false) {
      console.error(`DB error! Хранилище "${storeName}" не найдено.`);

      return;
    }

    let transaction = db.transaction([storeName], "readwrite");

    let store = transaction.objectStore(storeName);

    const dbRequest = store.add(data);

    dbRequest.onsuccess = () => {
      setTimeout(() => {
        cb(dbRequest.result);
      }, 500);
    };
  };
};

export const updateDB = <T>(
  operation: "create" | "update",
  storeName: string,
  data: T,
  cb: (id: IDBValidKey) => void
) => {
  let openRequest = indexedDB.open(DB_NAME, DB_VERSION);

  openRequest.onsuccess = function () {
    let db = openRequest.result;

    if (db.objectStoreNames.contains(storeName) === false) {
      console.error(`DB error! Хранилище "${storeName}" не найдено.`);

      return;
    }

    let transaction = db.transaction([storeName], "readwrite");

    let store = transaction.objectStore(storeName);

    const dbRequest =
      operation === "create" ? store.add(data) : store.put(data);

    dbRequest.onsuccess = () => {
      setTimeout(() => {
        cb(dbRequest.result);
      }, 500);
    };
  };
};

/**
 * Выполнить инициализацию таблиц
 */
function initObjectStores(openRequest: IDBOpenDBRequest): void {
  let db = openRequest.result;

  if (!db.objectStoreNames.contains("users")) {
    db.createObjectStore("users", { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains("columns")) {
    db.createObjectStore("columns", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("rows")) {
    db.createObjectStore("rows", { keyPath: "rowId", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("lists")) {
    db.createObjectStore("lists", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("listItems")) {
    db.createObjectStore("listItems", { keyPath: "id", autoIncrement: true });
  }
}

/**
 * Заполнение хранилища данными
 * из фикстур
 */
function applyFixtures(openRequest: IDBOpenDBRequest): void {
  openRequest.onsuccess = function () {
    console.log("Заполнение хранилища данными...");

    let db = openRequest.result;
    let transaction = db.transaction(
      ["users", "rows", "columns", "lists", "listItems"],
      "readwrite"
    );

    let users = transaction.objectStore("users");
    let columns = transaction.objectStore("columns");
    let rows = transaction.objectStore("rows");
    let lists = transaction.objectStore("lists");
    let listItems = transaction.objectStore("listItems");

    usersFixture.forEach((item) => addItem(users, item));
    columnsFixture.forEach((item) => addItem(columns, item));
    rowsFixture.forEach((item) => addItem(rows, item));
    listsFixture.forEach((item) => addItem(lists, item));
    listItemsFixture.forEach((item) => addItem(listItems, item));
  };
}

function addItem<T>(objectStore: IDBObjectStore, item: T) {
  const request = objectStore.add(item);

  request.onsuccess = function () {
    console.log(
      `[${objectStore.name}]: Элемент добавлен в хранилище. Key=${request.result}`
    );
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };
}
