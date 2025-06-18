# Driving Exam App (React Native + Azure AD)

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Authentication

- **Login Provider**: Microsoft Azure Active Directory (OAuth2)
- **Login Method**: 
  - Uses [`expo-auth-session`](https://docs.expo.dev/versions/latest/sdk/auth-session/) for secure Microsoft login on mobile.
  - Azure login flow is handled entirely on the **frontend**.
  - Backend can verify identity using the ID token if needed.


## Notes
- This app uses local device storage (AsyncStorage) to save completed exams.
- All questions are fetched from a backend API.
- The **Exam Simulation** feature randomly selects 20 questions from each module (handled by the backend controller).

## Get started

1. Start the backend server  
   Run the `startServer.cmd` file located in the `DrivingExamBackend` folder.

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the app on Android

   ```bash
   npm run android
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
