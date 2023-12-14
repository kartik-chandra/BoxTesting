import { useState, useEffect } from 'react';
import axios from 'axios';

const BookCategories = () => {
    const [categories, setCategories] = useState([]);
    /*const [categoriesNew, setCategoriesNew] = useState([]);*/

    useEffect(() => {
        const fetchBookCategories = async () => {
            try {
                const response = await axios.get('https://kcbapitest.sashiimi.com/api/book/categories');

                const data = await response.json();
                
                setCategories(data);
            } catch (error) {
                console.error('Error fetching book categories:', error);
            }

            //try {
            //    const response1 = await fetch('https://kcbapitest.sashiimi.com/api/book/categories');
            //    const data1 = await response1.json();

            //    setCategoriesNew(data1);
            //} catch (error) {
            //    console.error('Error fetching book categoriesNew:', error);
            //}
        };
        
        fetchBookCategories();
    }, []); 

    return (
        <div>
            <h5>Book Categories</h5>
            <ul>
                {categories.map((category) => (
                    <li key={category.Id}>
                        <strong>{category.Name}</strong> - {category.Description}
                    </li>
                ))}
            </ul>
            {/*<hr />*/}
            {/*<ul>*/}
            {/*    {categoriesNew.map((cat) => (*/}
            {/*        <li key={cat.Id}>*/}
            {/*            <strong>{cat.Name}</strong> - {cat.Description}*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    );
};

export default BookCategories;
