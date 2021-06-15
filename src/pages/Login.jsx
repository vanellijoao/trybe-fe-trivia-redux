import { connect } from 'react-redux';
import { playerData, questionsData } from '../actions';

const React = require('react');
const PropTypes = require('prop-types');

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.checkInputs = this.checkInputs.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.playGame = this.playGame.bind(this);
    this.goToSettings = this.goToSettings.bind(this);

    this.state = {
      isButtonDisabled: true,
      name: '',
      gravatarEmail: '',
    };
  }

  handleChange({ target: { value, name } }) {
    this.setState({ [name]: value }, this.checkInputs);
  }

  checkInputs() {
    const emailCheck = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const { name, gravatarEmail } = this.state;

    const isValid = name.length > 0 && gravatarEmail.match(emailCheck);

    if (isValid) {
      this.setState({ isButtonDisabled: false });
    }
  }

  async fetchToken() {
    const request = await fetch('https://opentdb.com/api_token.php?command=request');
    const response = await request.json();

    return response.token;
  }

  async fetchQuestion(token) {
    const request = await fetch(`https://opentdb.com/api.php?amount=5&encode=url3986&token=${token}`);
    const response = await request.json();

    return response.results;
  }

  async playGame() {
    const { history, sendPlayerData, sendQuestionsData } = this.props;
    const { name, gravatarEmail } = this.state;

    const token = await this.fetchToken();
    localStorage.setItem('token', token);
    const questions = await this.fetchQuestion(token);

    sendPlayerData({ name, gravatarEmail });
    sendQuestionsData(questions);

    history.push('/game');
  }

  goToSettings() {
    const { history } = this.props;
    history.push('/settings');
  }

  render() {
    const { isButtonDisabled } = this.state;

    return (
      <main>
        <section>
          <label htmlFor="name">
            Nome
            <input
              type="text"
              name="name"
              data-testid="input-player-name"
              id="name"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="gravatarEmail">
            Email
            <input
              type="email"
              name="gravatarEmail"
              id="gravatarEmail"
              data-testid="input-gravatar-email"
              onChange={ this.handleChange }
            />
          </label>
        </section>
        <section>
          <button
            type="button"
            data-testid="btn-play"
            disabled={ isButtonDisabled }
            onClick={ this.playGame }
          >
            Jogar
          </button>
        </section>
        <section>
          <button
            type="button"
            data-testid="btn-settings"
            onClick={ this.goToSettings }
          >
            Configurações
          </button>
        </section>
      </main>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape().isRequired,
  sendPlayerData: PropTypes.func.isRequired,
  sendQuestionsData: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  sendPlayerData: (state) => dispatch(playerData(state)),
  sendQuestionsData: (state) => dispatch(questionsData(state)),
});

export default connect(null, mapDispatchToProps)(Login);
