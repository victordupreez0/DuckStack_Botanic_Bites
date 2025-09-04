import React from 'react';

const ProductsTable = ({ products }) => (
  <div className="overflow-x-auto">
    <table className="table table-zebra">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Species</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => (
          <tr key={product._id || product.name}>
            <th>{idx + 1}</th>
            <td>{product.name}</td>
            <td>{product.species || '-'}</td>
            <td>R{product.price}</td>
            <td>1</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductsTable;