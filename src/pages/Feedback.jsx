import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

const React = require('react');

class Feedback extends React.Component {
  constructor() {
    super();

    this.feedbackText = this.feedbackText.bind(this);
  }

  feedbackText() {
    const ASSERTION = 3;
    const { assertions } = this.props;

    if (assertions < ASSERTION) {
      return 'Podia ser melhor...';
    }

    return 'Mandou bem!';
  }

  render() {
    const { assertions, score } = this.props;
    console.log(assertions);
    return (
      <>
        <Header />
        <h1 data-testid="feedback-text">{ this.feedbackText() }</h1>
        <h2 data-testid="feedback-total-score">{ score }</h2>
        <h2 data-testid="feedback-total-question">{ assertions }</h2>

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Feedback);
