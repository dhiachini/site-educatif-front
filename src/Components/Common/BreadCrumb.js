import React from "react";
import { Col, Row } from "reactstrap";

const BreadCrumb = ({ title }) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex align-items-center justify-content-center">
            <h2 className="mb-sm-0 text-center">{title}</h2>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
