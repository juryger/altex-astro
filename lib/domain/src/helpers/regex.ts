const regexTrue: RegExp = /^true$/i;
const regexSortParams: RegExp = /sort:(?<field>\w+):(?<direction>\d+)/i;
const regexPageParams: RegExp = /page:(?<offset>\d+):(?<limit>\d+)/i;
const regexFilterParams: RegExp = /filter:(?<field>\w+):(?<value>[\w]+)/gi;

export { regexTrue, regexSortParams, regexPageParams, regexFilterParams };
