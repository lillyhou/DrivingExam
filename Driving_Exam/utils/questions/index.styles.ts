
import { StyleSheet } from 'react-native';

export const styles =  StyleSheet.create({
  topicName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#007bff',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  questionNumber: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 3,
    color: 'rgb(25, 86, 166)',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 16,
    color: '#000',
  },
  questionImage: {
    width: '100%',
    height: 220,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerItem: {
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  answerText: {
    fontSize: 16,
    color: '#444',
  },
  buttonContainer: {
    marginTop: 16,
    alignSelf: 'center',
    width: '100%',
  },
  errorText: {
    color: '#ff3333',
    fontWeight: '600',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  nextButton: {
  backgroundColor: '#007bff',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

nextButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

disabledButton: {
  backgroundColor: '#ccc',
},

backButton: {
  marginTop: 12,
  backgroundColor: '#ccc',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
},

backButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},

submitButton: {
  backgroundColor: '#007BFF',
  padding: 12,
  borderRadius: 8,
  marginTop: 20,
  marginBottom: 10,
  alignItems: 'center',
},
submitButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},


});
