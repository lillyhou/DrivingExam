
import { StyleSheet } from 'react-native';

export const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  questionNumber: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
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
    width: '50%',
  },
  errorText: {
    color: '#ff3333',
    fontWeight: '600',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
});
