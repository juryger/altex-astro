import { createOperationsDb } from "@/lib/dal/src";
import type { GuestUser } from "@/web/src/core/models/guest-user";
import type { Guest } from "@/lib/dal/src/types";
import { guests } from "@/lib/dal/src/schema/operations";
import { encode } from "html-entities";

const mapDomainToDatabaseModel = (entity: GuestUser): Guest => {
  return {
    firstName: encode(entity.firstName ?? "---"),
    lastName: encode(entity.lastName ?? "---"),
    email: encode(entity.email ?? "---"),
    phone: entity.phone !== undefined ? encode(entity.phone) : null,
    compnayName:
      entity.compnayName !== undefined ? encode(entity.compnayName) : null,
    address: entity.address !== undefined ? encode(entity.address) : null,
    city: entity.city !== undefined ? encode(entity.city) : null,
    postCode: entity.postCode !== undefined ? encode(entity.postCode) : null,
  } as Guest;
};

export async function UpsertGuestUser(guest: GuestUser): Promise<number> {
  const db = createOperationsDb(import.meta.env.DB_OPERATIONS_PATH);
  const result = await db
    .insert(guests)
    .values(mapDomainToDatabaseModel(guest))
    .onConflictDoUpdate({
      target: guests.email,
      set: {
        firstName: encode(guest.firstName),
        lastName: encode(guest.lastName),
        phone: encode(guest.phone),
        compnayName: encode(guest.compnayName),
        address: encode(guest.address),
        city: encode(guest.city),
        postCode: encode(guest.postCode),
      },
    })
    .returning({ id: guests.id });

  return result.at(0)?.id ?? 0;
}
