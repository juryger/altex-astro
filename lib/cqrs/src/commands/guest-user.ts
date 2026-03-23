import type { GuestUser } from "@/lib/domain";
import type { Guest as DBGuest } from "@/lib/dal";
import { createOperationsDb } from "@/lib/dal";
import {
  EnvironmentNames,
  NO_VALUE_ASSIGNED,
  selectEnvironment,
} from "@/lib/domain";
import { guests } from "@/lib/dal";

const mapDomainToDatabaseModel = (entity: GuestUser): DBGuest => {
  return {
    fullName: entity.fullName ?? NO_VALUE_ASSIGNED,
    email: entity.email ?? NO_VALUE_ASSIGNED,
    phone: entity.phone !== undefined ? entity.phone : null,
    companyName: entity.companyName !== undefined ? entity.companyName : null,
    address: entity.address !== undefined ? entity.address : null,
    city: entity.city !== undefined ? entity.city : null,
    postCode: entity.postCode !== undefined ? entity.postCode : null,
    taxNumber: entity.taxNumber !== undefined ? entity.taxNumber : null,
    uid: entity.uid,
  } as DBGuest;
};

export async function upsertGuestUser(guest: GuestUser): Promise<number> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  const result = await db
    .insert(guests)
    .values(mapDomainToDatabaseModel(guest))
    .onConflictDoUpdate({
      target: guests.email,
      set: {
        fullName: guest.fullName,
        phone: guest.phone,
        companyName: guest.companyName,
        address: guest.address,
        city: guest.city,
        postCode: guest.postCode,
        taxNumber: guest.taxNumber,
        uid: guest.uid,
      },
    })
    .returning({ id: guests.id });

  return result.at(0)?.id ?? 0;
}
