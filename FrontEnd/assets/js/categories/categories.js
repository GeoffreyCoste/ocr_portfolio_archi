/*****************
 * categories.js *
 * ***************/


// get database categories datas
const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        return categories;
    } catch (e) {
        console.error(e); // No further error management measure due to the fact that 'getNoDuplicateCategoriesArr()' returns empty array if data request status is not 200 range
    };
};

// map categories to only keep name property and remove duplicate if any
const getNoDuplicateCategoriesArr = async () => {
    const data = getCategories();
    const json = await data || [];
    const nameArr = json.map(item => item.name);
    const categories = [...new Set(nameArr)];

    return categories;
}

export { getCategories, getNoDuplicateCategoriesArr };