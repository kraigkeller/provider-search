import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import './index.css';

const SEARCH_PROVIDERS = gql`
  query SearchProviders($filters: SearchFilters!) {
    searchProviders(filters: $filters) {
      id
      name
      specialty
      address
      phone
      location {
        zipCode
        county
        state
      }
    }
  }
`;

const App = () => {
  const [searchInput, setSearchInput] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [fetchProviders, { loading, error, data }] = useLazyQuery(SEARCH_PROVIDERS);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    if (error) {
      fetchProviders({ variables: { filters: {} }, fetchPolicy: 'no-cache' });
    }
  };

  const handleSpecialtyChange = (e) => {
    setSpecialtyFilter(e.target.value);
    if (error) {
      fetchProviders({ variables: { filters: {} }, fetchPolicy: 'no-cache' });
    }
  };

  const handleSearch = () => {
    let filters = {};
    if (/^\d{5}$/.test(searchInput)) {
      filters = { zipCode: searchInput, specialty: specialtyFilter };
    } else {
      filters = { name: searchInput, specialty: specialtyFilter };
    }
    fetchProviders({ 
      variables: { filters },
      fetchPolicy: 'no-cache'
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Healthcare Provider Finder</h1>
        <p>
          Enter a 5-digit ZIP code or a provider's name in the search box below. The search will return a list of healthcare providers that match your criteria.
        </p>
      </header>
      <div className="search-controls">
        <input
          type="text"
          value={searchInput}
          placeholder="Enter ZIP code or Provider Name"
          onChange={handleInputChange}
        />
        <input
          type="text"
          value={specialtyFilter}
          placeholder="Filter by Specialty"
          onChange={handleSpecialtyChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && data.searchProviders && data.searchProviders.length > 0 ? (
        <ul>
          {data.searchProviders.map(provider => (
            <li key={provider.id}>
              <strong>{provider.name}</strong> - {provider.specialty}<br />
              {provider.address} | {provider.location.county}, {provider.location.state} ({provider.location.zipCode})<br />
              {provider.phone}
            </li>
          ))}
        </ul>
      ) : data && data.searchProviders && data.searchProviders.length === 0 ? (
        <p>No providers found.</p>
      ) : null}
    </div>
  );
};

export default App;
