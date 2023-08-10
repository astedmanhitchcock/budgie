import { useEffect, useState } from 'react';

interface category {
  id: any
}

const Categories: React.FC = () => {
  const [allCategories, setAllCategories] = useState<category[]>([]);
  const [pageError, setPageError] = useState<boolean>(false);

  useEffect(() => {
    const getCategories = async () => {
      fetch(`${process.env.API_URL}categories`, {
        method: "GET"
      }).then(async (res) => {
        if (res.ok) {
          const jsonData = await res.json();
          setAllCategories(jsonData);
          
          console.log('categories :: ', jsonData);
        } else {
          setPageError(true)
        }
      }).catch(err => {
        setPageError(true)
      });
    };
    getCategories();
    console.log('categories page!')
  }, []);

  return (
    <div>
      <h2>
        Categories
      </h2>
      {pageError && (
        <>
        Error getting data.
        </>
      )}
    </div>
  );
};

export default Categories;