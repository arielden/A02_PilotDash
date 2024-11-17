// src/components/DashboardCards.jsx

import React from 'react';

const DashboardCards = () => {
  const cards = [
    { title: "Primary Card", bgClass: "bg-primary" },
    { title: "Warning Card", bgClass: "bg-warning" },
    { title: "Success Card", bgClass: "bg-success" },
    { title: "Danger Card", bgClass: "bg-danger" },
  ];

  return (
    <div className="row">
      {cards.map((card, index) => (
        <div className="col-xl-3 col-md-6" key={index}>
          <div className={`card text-white mb-4 ${card.bgClass}`}>
            <div className="card-body">{card.title}</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <a className="small text-white stretched-link" href="#">View Details</a>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
