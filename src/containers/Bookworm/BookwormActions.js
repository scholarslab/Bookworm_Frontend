export const LOAD_OPTIONS = 'LOAD_OPTIONS';
// Loading Files
export const loadOptions = (options) => ({
    type: 'LOAD_OPTIONS',
    options
});

// export const getJSON = () => {
//     return (dispatch) => {
//         fetch('./options.json', {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             }
//         })
//             .then((response) => {
//                 response.json()
//                     .catch(err => {
//                         console.error(err);
//                     })
//                     .then(json => {
//                         console.log(json);
//                         dispatch(loadOptions(json));
//                     });
//             });
//     };
// };