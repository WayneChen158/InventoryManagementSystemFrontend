import PropTypes from 'prop-types';

export default function RequestPurchasePageOngoing({
    allRequestData,
    triggerRefresh,
    statusCode,
}) {
    return (<h1>Ongoing purchase request</h1>);
}

RequestPurchasePageOngoing.propTypes = {
    allRequestData: PropTypes.array.isRequired,
    triggerRefresh: PropTypes.func.isRequired,
    statusCode: PropTypes.number.isRequired,
}