/// <reference path=".d/jquery.d.ts"/>
/// <reference path=".d/jquery.extend.d.ts"/>
/// <reference path=".d/jquery.pjax.d.ts"/>

// Correct
interface Window {
  DOMParser?: any
}
interface IDBEnvironment {
  webkitIndexedDB?: IDBFactory
  mozIndexedDB?: IDBFactory
}
interface Window {
  IDBKeyRange?: typeof IDBKeyRange
  webkitIDBKeyRange?: typeof IDBKeyRange
  mozIDBKeyRange?: typeof IDBKeyRange
  msIDBKeyRange?: typeof IDBKeyRange
}

interface JQueryXHR {
  location?: HTMLAnchorElement
  host?: string
  follow?: boolean
  timeStamp?: number
}

module MODULE.DEF {
  export var NAME: string = 'pjax'
  export var NAMESPACE: any = jQuery
}

module MODULE {
  /*
   * 仕様
   * -----
   * 
   * 構成
   * 
   * Rayer:
   * - View
   * - Controller
   * - Model(mvc-interface)
   * - Model(application-rogic)
   * - Model(data-access)
   * 
   * Model:
   * - class Main (mvc-interface)
   *   - singleton
   * - class App (application-logic)
   *   - singleton
   * - class Data (data-access)
   *   - singleton
   * 
   * View
   * - class Main (mvc-interface)
   * 
   * Controller
   * - class Main (mvc-interface)
   *   - singleton
   * - class Functions
   * - class Methods
   * 
   * -----
   * 
   * 規約
   * 
   * - MVCモジュール間のアクセスは各モジュールのインターフェイスを経由し、内部機能(APP/DATA)に直接アクセスしない。
   * - モデルインターフェイスへ渡されるデータはすべて正規化、検疫されてないものとして自身で正規化、検疫する。
   * - データレイヤーへのアクセスはアプリケーションレイヤーのDataクラスからのみとする。
   * 
   */
  export module MODEL { }
  export module VIEW { }
  export module CONTROLLER { }

  // Model Interface
  export declare class ModelInterface {
    constructor()

    // Model
    isDeferrable: boolean
    location: HTMLAnchorElement
    state(): State
    host(): string
    convertUrlToKey(unsafe_url: string, canonicalize?: boolean): string
    compareKeyByUrl(a: string, b: string): boolean
    comparePageByUrl(a: string, b: string): boolean
    configure(destination: string | Event | HTMLAnchorElement | HTMLFormElement | Location): SettingInterface
    getXHR(): JQueryXHR
    setXHR($xhr: JQueryXHR): JQueryXHR
    isOperatable(event: JQueryEventObject): boolean
    fallback(event: JQueryEventObject): void
    isHashChange(setting: SettingInterface): boolean
    overlay(setting: SettingInterface): boolean
    bypass(): JQueryDeferred<any>
    speed: any
    
    // Controller
    enable(): void
    disable(): void
    click(event: JQueryEventObject): void
    submit(event: JQueryEventObject): void
    popstate(event: JQueryEventObject): void
    scroll(event: JQueryEventObject, end: boolean): void
    getCache(unsafe_url: string): CacheInterface
    setCache(unsafe_url: string, data: string, textStatus: string, jqXHR: JQueryXHR): void
    removeCache(unsafe_url: string): void
    clearCache(): void
  }
  // View Interface
  export declare class ViewInterface {
    constructor(model: ModelInterface, controller: ControllerInterface, $context: JQuery, setting: SettingInterface)
  }
  // Controller Interface
  export declare class ControllerInterface {
    constructor(model: ModelInterface)
    
    view(context: JQuery, setting: SettingInterface): ViewInterface

    click(args: IArguments): void
    submit(args: IArguments): void
    popstate(args: IArguments): void
    scroll(args: IArguments): void
  }

  // State
  export enum State { blank, initiate, open, pause, lock, seal, error, crash, terminate, close }

  // Event
  export var EVENT = {
    PJAX: DEF.NAME.toLowerCase(),
    CLICK: 'click',
    SUBMIT: 'submit',
    POPSTATE: 'popstate',
    SCROLL: 'scroll'
  }

  // Context
  export interface ExtensionInterface extends JQueryPjax { }
  export interface ExtensionStaticInterface extends JQueryPjaxStatic { }

  // Parameter
  export interface SettingInterface extends PjaxSetting {
    // internal
    uid: string
    ns: string
    nss: {
      array: string[]
      name: string
      data: string
      url: string
      event: {
        pjax: {
          fetch: string
          unload: string
          DOMContentLoaded: string
          ready: string
          render: string
          load: string
        }
        click: string
        submit: string
        popstate: string
        scroll: string
      }
      elem: string
      requestHeader: string
    }
    origLocation: HTMLAnchorElement
    destLocation: HTMLAnchorElement
    option: PjaxSetting
    speedcheck: boolean
  }

  // Object
  export interface CacheInterface extends PjaxCache {
    host: string
  }
}

module MODULE.MODEL {
  // APP Layer
  export declare class AppLayerInterface {
    balancer: BalancerInterface
    page: PageInterface
    data: DataInterface

    initialize($context: JQuery, setting: SettingInterface): void
    configure(destination: string | Event | HTMLAnchorElement | HTMLFormElement | Location | PjaxSetting): SettingInterface
  }

  // Balanse
  export declare class BalancerInterface {
    constructor(data: DataInterface)
    host(): string
    sanitize(host: string, setting: SettingInterface): string
    sanitize($xhr: JQueryXHR, setting: SettingInterface): string
    
    enable(setting: SettingInterface): void
    disable(setting: SettingInterface): void
    score(time: number, size: number): number
    changeServer(host: string, setting: SettingInterface): string
    chooseServer(setting: SettingInterface): string
    bypass(setting: SettingInterface): JQueryDeferred<any>
  }

  // Page
  export declare class PageInterface extends PageUtilityInterface {
    constructor(model: ModelInterface, app: AppLayerInterface)

    parser: PageParserInterface
    provider: PageProviderInterface

    landing: string
    loadedScripts: { [url: string]: boolean }
    xhr: JQueryXHR

    loadtime: number
    count: number
    time: number
    
    transfer(setting: SettingInterface, event: JQueryEventObject): void

    getWait(): JQueryDeferred<any>
    setWait(wait: JQueryDeferred<any>): JQueryDeferred<any>
  }
  // Page::Provider
  export declare class PageProviderInterface implements ProviderInterface {
    constructor(Record: PageRecordInterface, model: ModelInterface, app: AppLayerInterface)
    fetchRecord(
      setting: SettingInterface,
      event: JQueryEventObject,
      success: (record: PageRecordInterface, setting: SettingInterface, event: JQueryEventObject) => void,
      failure: (record: PageRecordInterface, setting: SettingInterface, event: JQueryEventObject) => void
    ): void
    pullRecord(
      setting: SettingInterface,
      event: JQueryEventObject,
      success: (record: PageRecordInterface, setting: SettingInterface, event: JQueryEventObject) => void,
      failure: (record: PageRecordInterface, setting: SettingInterface, event: JQueryEventObject) => void
    ): void
    getRecord(setting: SettingInterface): PageRecordInterface
    setRecord(setting: SettingInterface, data: string, textStatus: string, $xhr: JQueryXHR, host: string): PageRecordInterface
    removeRecord(setting: SettingInterface): PageRecordInterface
    clearRecord(): void
  }
  export declare class PageRecordInterface implements RecordInterface {
    constructor()
    constructor(url: string, data: string, textStatus: string, $xhr: JQueryXHR, host: string)
    data: PageRecordDataInterface
    state(setting?: SettingInterface): boolean
  }
  export declare class PageRecordDataInterface implements RecordDataInterface {
    url(): string
    data(): string
    textStatus(): string
    jqXHR(): JQueryXHR
    host(): string
    expires(): number
    expires(min: number, max: number): number
  }
  export interface PageRecordSchema extends RecordSchema {
    url: string
    data: string
    textStatus: string
    jqXHR: JQueryXHR
    host: string
  }
  // Page::Parser
  export declare class PageParserInterface {
    parse(html: string, uri?: string): Document
  }
  // Page::Utility
  export declare class PageUtilityInterface {
    chooseArea(area: string | string[], srcDocument: Document, dstDocument: Document): string
    dispatchEvent(target: Window | Document | HTMLElement, eventType: string, bubbling: boolean, cancelable: boolean): void
  }

  // Data
  export declare class DataInterface {
    constructor(model: ModelInterface)

    // cookie
    getCookie(key: string): string
    setCookie(key: string, value: string, option?: CookieOptionInterface): string

    // db
    connect(setting: SettingInterface): void
    
    // common
    loadBuffers(): void
    saveBuffers(): void

    // meta

    // history
    getHistoryBuffer(unsafe_url: string): HistoryStoreSchema
    loadTitle(): void
    saveTitle(): void
    saveTitle(unsafe_url: string, title: string): void
    loadScrollPosition(): void
    saveScrollPosition(): void
    saveScrollPosition(unsafe_url: string, scrollX: number, scrollY: number): void
    loadExpires(): void
    saveExpires(unsafe_url: string, host: string, expires: number): void

    // server
    getServerBuffers(): StoreSchemata<ServerStoreSchema>
    getServerBuffer(unsafe_url: string): ServerStoreSchema
    loadServer(): void
    saveServer(host: string, expires: number, time: number, score: number, state: number): void
    removeServer(host: string): void
  }
  export interface CookieOptionInterface {
    age: number
    path: string
    domain: string
    secure: boolean
  }
  export interface StoreSchemata<T> {
    [index: string]: T
  }
  export interface MetaStoreSchema {
    key: string
    value: any
  }
  export interface HistoryStoreSchema {
    url: string     // primary
    title: string   // fix
    date: number    // fix
    scrollX: number // fix
    scrollY: number // fix
    expires: number // balance
    host: string    // balance
  }
  export interface ServerStoreSchema {
    host: string
    state: number // 0:正常, !0:異常発生時刻(ミリ秒)
    time: number
    score: number
    expires: number
  }
}

module MODULE.MODEL.APP {
  // DATA Layer
  export declare class DataLayerInterface {
    DB: DATA.DatabaseInterface
    Cookie: DATA.CookieInterface
  }
}

module MODULE.MODEL.APP.DATA {
  // Cookie
  export declare class CookieInterface {
    constructor(age: number)

    getCookie(key: string): string
    setCookie(key: string, value: string, option?: CookieOptionInterface): string
  }
  
  // Database
  export declare class DatabaseInterface {
    IDBFactory: IDBFactory
    IDBKeyRange: typeof IDBKeyRange
    
    state(): State

    database(): IDBDatabase
    configure(revision: number, refresh: number): void
    up(): void
    down(): void
    open(): DatabaseTaskReserveInterface
    close(): void
    resolve(): void
    reject(): void

    stores: DatabaseSchema
    meta: {
      version: { key: string; value: number; }
      update: { key: string; value: number; }
      revision: { key: string; value: number; }
    }
  }
  export interface DatabaseSchema {
    meta: StoreInterface<MetaStoreSchema>
    history: StoreInterface<HistoryStoreSchema>
    server: StoreInterface<ServerStoreSchema>
  }
  export interface DatabaseTaskInterface extends DatabaseTaskReserveInterface, DatabaseTaskDigestInterface {
  }
  export declare class DatabaseTaskReserveInterface {
    done(callback: () => void): DatabaseTaskReserveInterface
    fail(callback: () => void): DatabaseTaskReserveInterface
    always(callback: () => void): DatabaseTaskReserveInterface
  }
  export declare class DatabaseTaskDigestInterface {
    resolve(): DatabaseTaskDigestInterface
    reject(): DatabaseTaskDigestInterface
  }
  export declare class DatabaseStatefulInterface {
    constructor(origin: DatabaseInterface, connect: () => void, extend: () => void)
    open(): DatabaseTaskReserveInterface
    resolve(): void
    reject(): void
  }
  export interface DatabaseStatefulClassInterface {
    new (origin: DatabaseInterface, connect: () => void, extend: () => void, task: TaskInterface, taskable: boolean): DatabaseStatefulInterface
  }
  export declare class StoreInterface<T> {
    constructor(DB: DatabaseInterface)

    name: string
    keyPath: string
    autoIncrement: boolean
    indexes: StoreIndexOptionInterface[]
    size: number

    get(key: number, callback: (event: Event) => void): void
    get(key: string, callback: (event: Event) => void): void
    set(value: T, merge?: boolean): void
    remove(key: number): void
    remove(key: string): void
    clear(): void
    clean(): void

    loadBuffer(callback?: () => void): void
    saveBuffer(callback?: () => void): void
    getBuffers(): StoreSchemata<T>
    setBuffers(values: T[], merge?: boolean): StoreSchemata<T>
    getBuffer(key: string): T
    getBuffer(key: number): T
    setBuffer(value: T, merge?: boolean): T
    removeBuffer(key: string): T
    removeBuffer(key: number): T
    clearBuffer(): void
  }
  export interface StoreIndexOptionInterface {
    name: string
    keyPath: string
    option?: {
      unique: boolean
    }
  }
}

module MODULE {
  // Macro
  export function MIXIN(baseClass: Function, mixClasses: Function[]): void {
    var baseClassPrototype = baseClass.prototype;
    mixClasses = mixClasses.reverse();
    for (var iMixClasses = mixClasses.length; iMixClasses--;) {
      var mixClassPrototype = mixClasses[iMixClasses].prototype;
      for (var iProperty in mixClassPrototype) {
        if ('constructor' === iProperty || !baseClassPrototype[iProperty] || !mixClassPrototype.hasOwnProperty(iProperty)) { continue; }
        baseClassPrototype[iProperty] = mixClassPrototype[iProperty];
      }
    }
  }

  export function UUID(): string {
    // version 4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, gen);
    function gen(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    }
  }

  export function FREEZE<T>(object: T, deep?: boolean): T {
    if (!Object.freeze || object === object['window'] || 'ownerDocument' in object) { return object; }
    !Object.isFrozen(object) && Object.freeze(object);
    if (!deep) { return object; }
    for (var i in object) {
      var prop = object[i];
      if (~'object,function'.indexOf(typeof prop) && prop) {
        FREEZE(prop, deep);
      }
    }
    return object;
  }

  export function SEAL<T>(object: T, deep?: boolean): T {
    if (!Object.seal || object === object['window'] || 'ownerDocument' in object) { return object; }
    !Object.isSealed(object) && Object.seal(object);
    if (!deep) { return object; }
    for (var i in object) {
      var prop = object[i];
      if (~'object,function'.indexOf(typeof prop) && prop) {
        SEAL(prop, deep);
      }
    }
    return object;
  }
}

module MODULE {
  // LIBRARY

  // Provider
  export declare class ProviderInterface {
    constructor(Record: RecordClassInterface, ...args: any[])
    fetchRecord(...args: any[]): void
    pullRecord(...args: any[]): void
    getRecord(...args: any[]): RecordInterface
    setRecord(...args: any[]): RecordInterface
  }
  export declare class RecordInterface {
    data: RecordDataInterface
    state(): boolean
  }
  export interface RecordClassInterface {
  }
  export declare class RecordDataInterface {
    constructor(data: RecordSchema)
  }
  export interface RecordSchema {
  }
  // Task
  export declare class TaskInterface {
    constructor(mode?: number, size?: number)
    define(name: string, mode: number, size: number): void
    reserve(task: () => void): void
    reserve(name: string, task: () => void): void
    digest(limit?: number): void
    digest(name: string, limit?: number): void
    clear(name?: string): void
  }
}
