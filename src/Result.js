import React from 'react';
import './Result.css';  // Ensure you import the CSS file for styling

const Result = ({ result }) => {
    return (
        <div className="result">
            <h2>{result.name}</h2>
            <p><strong>Address:</strong> {result.address}</p>
            <div className="photos">
                <h3>Photos</h3>
                {result.photo.images.small && (
                    <img src={result.photo.images.small.url} alt={result.photo.caption} />
                )}
                {result.photo.images.medium && (
                    <img src={result.photo.images.medium.url} alt={result.photo.caption} />
                )}
            </div>
            <p><strong>Rating:</strong> {result.rating}</p>
            <p><strong>Price Level:</strong> {result.price_level}</p>
            <div className="cuisines">
                <strong>Cuisines:</strong>
                {result.cuisine.map((cuisine, index) => (
                    <span key={index}>{cuisine.name}</span>
                ))}
            </div>
            <p><strong>Number of Reviews:</strong> {result.num_reviews}</p>
            <div className="reviews">
                <h3>Reviews</h3>
                <ul>
                    {result.reviews.map((review, index) => (
                        <li key={index}>
                            <p><strong>Author:</strong> {review.author}</p>
                            <p><strong>Rating:</strong> {review.rating}</p>
                            <p><strong>Summary:</strong> {review.summary}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Result;
