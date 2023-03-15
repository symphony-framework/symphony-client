import SyncedList from './SyncedList.js';
import SyncedMap from './SyncedMap.js';

/**
 * @classdesc Room object returned when calling <tt>Client.enter</tt>.
 * @hideconstructor
 */
class Room {
  #wsProvider;
  #ydoc;
  constructor(wsProvider, ydoc) {
    this.#wsProvider = wsProvider;
    this.#ydoc = ydoc;
  }

  // https://liveblocks.io/docs/api-reference/liveblocks-client#Room.subscribe(storageItem)

  // Could implement other subscribe methods e.g. connection, error, history, storage-status

  /** Subscribes to updates for an item.
   * If the <tt>subscribedItem</tt> is a SyncedList or SyncedMap, the provided callback is executed whenever that shared type changes.
   * If the <tt>subscribedItem</tt> is <tt>'others'</tt>, the provided callback is executed whenever another client's presence changes.
   * 
   * @param {SyncedList | SyncedMap | string} subscribedItem 
   * @param {function} callback 
   * @param {boolean} isDeepObject Not implemented
   */
  subscribe(subscribedItem, callback, isDeepObject) {
    if (subscribedItem instanceof SyncedList || subscribedItem instanceof SyncedMap) {
      subscribedItem.observe(callback);
    } else if (subscribedItem === 'others') {
      this.#wsProvider.awareness.on('change', callback);
    }      
  }

  /** Stops subscribing to the SyncedList or SyncedMap passed as an argument.*/
  unsubscribe(subscribedItem, callback) {
    if (subscribedItem instanceof SyncedList || subscribedItem instanceof SyncedMap) {
      subscribedItem.unobserve(callback);
    }
  }

  // Gets the presence of the current user.
  // getPresence() {
    
  // }

  /** Returns the id of the client.*/
  getClientId() {
    return this.#wsProvider.awareness.clientID;
  }

  /** Updates the presence of the client. Properties passed as arguments will be updated, while other properties of presence will remain unchanged.*/
  updatePresence(updatedPresence) {
    const currentPresence = this.#wsProvider.awareness.getLocalState();
    this.#wsProvider.awareness.setLocalState({
      ...currentPresence,
      ...updatedPresence,
    });
  }

  // Gets all the other users in the Room.
  // [currently this returns all users including the client, like yjs does]
  /** Returns all other users in the Room.*/
  getOthers() {
    return this.#wsProvider.awareness.getStates();
  }

  /**  Merges operations in the callback function into a single operation.*/
  bundle(callback) {
    this.#ydoc.transact(callback);
  }

  // Gets the current user. Returns null if it is not yet connected to the room.
  // getSelf() {

  // }  

  // Get the storage status.
  // not-loaded: Initial state when entering the room.
  // loading: Once the storage has been requested via room.getStorage().
  // synchronizing: When some local updates have not been acknowledged by Liveblocks servers.
  // synchronized: Storage is in sync with Liveblocks servers.
  // getStorageStatus() {

  // }

  // Close the room connection and try to reconnect.
  // reconnect() {
    
  // }

  // Get the room’s storage asynchronously (returns a Promise). The storage’s root is a LiveObject.
  // async getStorage() {
  //   // return { root }
  // }

  /** Returns a new SyncedList.*/
  newList(name) {
    return new SyncedList(this.#ydoc, name);
  }

  /** Returns a new SyncedMap.*/
  newMap(name) {
    return new SyncedMap(this.#ydoc, name);
  }
}

export default Room;