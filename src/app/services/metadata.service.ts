import { Injectable } from '@angular/core';

@Injectable()
export class MetadataService {

  constructor() { }

  hasMetadata (metadata: any): boolean {
    return Boolean(metadata && Object.keys(metadata).length)
  }

  hasLocationMetadata (metadata: any): boolean {
    return Boolean(metadata && Object.keys(metadata).length && metadata.lat && metadata.lng)
  }

}
