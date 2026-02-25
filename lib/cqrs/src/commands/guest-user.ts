import type { GuestUser } from "@/lib/domain";
import type { Guest } from "@/lib/dal";
import { createOperationsDb } from "@/lib/dal";
import {
  EnvironmentNames,
  NO_VALUE_ASSIGNED,
  selectEnvironment,
} from "@/lib/domain";
import { guests } from "@/lib/dal";
import { encode } from "html-entities";

const mapDomainToDatabaseModel = (entity: GuestUser): Guest => {
  return {
    fullName: encode(entity.fullName ?? NO_VALUE_ASSIGNED),
    email: encode(entity.email ?? NO_VALUE_ASSIGNED),
    phone: entity.phone !== undefined ? encode(entity.phone) : null,
    companyName:
      entity.companyName !== undefined ? encode(entity.companyName) : null,
    address: entity.address !== undefined ? encode(entity.address) : null,
    city: entity.city !== undefined ? encode(entity.city) : null,
    postCode: entity.postCode !== undefined ? encode(entity.postCode) : null,
    taxNumber: entity.taxNumber !== undefined ? encode(entity.taxNumber) : null,
    uid: entity.uid,
  } as Guest;
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
        fullName: encode(guest.fullName),
        phone: encode(guest.phone),
        companyName: encode(guest.companyName),
        address: encode(guest.address),
        city: encode(guest.city),
        postCode: encode(guest.postCode),
        taxNumber: encode(guest.taxNumber),
        uid: guest.uid,
      },
    })
    .returning({ id: guests.id });

  return result.at(0)?.id ?? 0;
}
