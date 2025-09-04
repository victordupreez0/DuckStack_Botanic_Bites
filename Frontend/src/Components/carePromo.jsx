import React from 'react';
import CareGuideBanner, { Card } from './careGuideBanner'
import CareGuideBannerBody from './careGuideBannerBody'

function CarePromo() {
  return (
    <div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-200 max-w-7xl mx-5 md:mx-auto overflow-hidden mt-10 mb-20 rounded-2xl" style={{ minHeight: '600px' }}>
      <div>
        <CareGuideBannerBody />
      </div>
      <div className="flex justify-center">
        <CareGuideBanner
          cardDistance={60}
          verticalDistance={30}
          delay={5000}
          pauseOnHover={false}
        >
          <Card>
            <h3 className="text-left ml-5 mt-2">Venus Flytaps</h3>
            <p>Your content here</p>
          </Card>
          <Card>
            <h3 className="text-left ml-5 mt-2">Sundews</h3>
            <p>Your content here</p>
          </Card>
          <Card>
            <h3 className="text-left ml-5 mt-2">Tropical Pitchers</h3>
            <p>Your content here</p>
          </Card>
        </CareGuideBanner>
      </div>
    </div>
    </div>
  );
}

export default CarePromo;