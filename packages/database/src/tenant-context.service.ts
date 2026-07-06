import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

export interface TenantStore {
  tenantId?: string;
  schemaName?: string;
  isPlatformAdmin?: boolean;
  userId?: string;
  email?: string;
}

@Injectable()
export class TenantContextService {
  private static readonly als = new AsyncLocalStorage<TenantStore>();

  run(context: TenantStore, callback: () => any): any {
    return TenantContextService.als.run(context, callback);
  }

  getStore(): TenantStore | undefined {
    return TenantContextService.als.getStore();
  }

  getTenantId(): string | undefined {
    return this.getStore()?.tenantId;
  }

  getSchemaName(): string | undefined {
    const store = this.getStore();
    if (store?.isPlatformAdmin) {
      return "public";
    }
    return store?.schemaName;
  }

  isPlatformAdmin(): boolean {
    return !!this.getStore()?.isPlatformAdmin;
  }

  getUserId(): string | undefined {
    return this.getStore()?.userId;
  }

  getEmail(): string | undefined {
    return this.getStore()?.email;
  }
}
