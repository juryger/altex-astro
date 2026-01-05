declare module "astro:actions" {
	type Actions = typeof import("/Users/iuriig/Sources/altex-astro/web/src/actions/index.ts")["server"];

	export const actions: Actions;
}