const getFormElementByName = (
  rootNode: Element,
  name: string | undefined,
): Element | null => {
  const result = rootNode.querySelector(`form[name='${name}']`);
  console.assert(
    result !== null,
    "~ dom-utils ~ cannot find form element [%s]",
    name,
  );
  return result;
};

const getDialogElementById = (
  rootNode: Element,
  name: string | undefined,
): Element | null => {
  const result = rootNode.querySelector(`dialog[id='${name}']`);
  console.assert(
    result !== null,
    "~ dom-utils ~ cannot find dialog element [%s]",
    name,
  );
  return result;
};

const getInputElementByName = (
  rootNode: Element,
  name: string | undefined,
): Element | null => {
  const result = rootNode.querySelector(`input[name='${name}']`);
  console.assert(
    result !== null,
    "~ dom-utils ~ cannot find input element [%s]",
    name,
  );
  return result;
};

const getButtonElementByName = (
  rootNode: Element,
  name: string | undefined,
): Element | null => {
  const result = rootNode.querySelector(`button[name='${name}']`);
  console.assert(
    result !== null,
    "~ dom-utils ~ cannot find button element [%s]",
    name,
  );
  return result;
};

const getElementById = (
  rootNode: Element,
  id: string | undefined,
): Element | null => {
  const result = rootNode.querySelector(`#${id}`);
  console.assert(
    result !== null,
    "~ dom-utils ~ cannot find element by ID: [%s]",
    id,
  );
  return result;
};

const getElementByDataAttribute = (
  rootNode: Element,
  name: string | undefined,
): Element | null => {
  const result = rootNode.querySelector(`[${name}]`);
  console.assert(
    result !== null,
    "~ dom-utils ~ cannot find data element: [%s]",
    name,
  );
  return result;
};

export {
  getFormElementByName,
  getDialogElementById,
  getInputElementByName,
  getButtonElementByName,
  getElementById,
  getElementByDataAttribute,
};
