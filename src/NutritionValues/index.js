import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nutriments from './nutriments';
import './nutriments.css';

const useNumberOfPages = () => {
  const [nbOfPages, setNbOfPages] = useState(-1);
  useEffect(() => {
    const getData = async () => {
      const {
        data: { count, page_size },
      } = await axios(
        `${
          process.env.REACT_APP_OFF_BASE
        }state/photos-validated/state/nutrition-facts-to-be-completed/1.json?fields=null`,
      );

      setNbOfPages(Math.ceil(count / page_size));
    };
    getData();
  }, []);

  return nbOfPages;
};

const useGetProduct = nbOfPages => {
  const [productsBacklog, setProductsBacklog] = useState([]);

  useEffect(() => {
    if (nbOfPages >= 0 && productsBacklog.length < 6) {
      const AddProducts = async () => {
        const randomPage = Math.floor(Math.random() * nbOfPages);
        let {
          data: { products },
        } = await axios(
          `${
            process.env.REACT_APP_OFF_BASE
          }/state/photos-validated/state/nutrition-facts-to-be-completed/${randomPage}.json?fields=code,lang,image_nutrition_url`,
        );
        products = products.map(product => {
          return {
            code: product.code,
            imageUrl: product.image_nutrition_url,
            lang: product.lang,
          };
        });
        setProductsBacklog([...productsBacklog, ...products]);
      };
      AddProducts();
    }
  }, [nbOfPages, productsBacklog]);

  return [productsBacklog, setProductsBacklog];
};

const NutritionValues = () => {
  const nbOfPages = useNumberOfPages();
  const [products, setProducts] = useGetProduct(nbOfPages);

  if (nbOfPages < 0) {
    return <p>Connextion to the API</p>;
  }

  if (products.length === 0) {
    return <p>Loading Products</p>;
  }

  return (
    <div className="root">
      <img src={products[0].imageUrl} alt="product" />
      <ul className="fields">
        {Object.keys(nutriments).map(nutrimentName => (
          <li key={nutrimentName}>
            <p className="nutrition-label">{nutrimentName}</p>
            <input type="number" className="nutrition-input" />
            <button className="nutrition-validation">validate</button>
            <button className="nutrition-deletion">delete</button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          setProducts(products.slice(1));
        }}
      >
        skip
      </button>
    </div>
  );
};

export default NutritionValues;
