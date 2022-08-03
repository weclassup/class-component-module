import React, { useEffect } from "react";
import { Redirect, Route, Router, Switch, useHistory } from "react-router-dom";

import history from "../../history";

import useStudentAuth from "../../store/useStudentAuth";
import useTeacherAuth from "../../store/useTeacherAuth";

import { isNotSet, isSet, isTrue } from "../../helper/format.checker";

import AuthHeader from "./AuthHeader/AuthHeader";
import Container from "../Container/Container";
import Loader from "../Loader/Loader";

import WelcomePage from "./Page/WelcomePage/WelcomePage";

import StudentRegistry from "./Page/Student/Register/StudentRegistry";
import StudentSignIn from "./Page/Student/SignIn/StudentSignIn";
import StudentForgotPassword from "./Page/Student/ForgotPassword/StudentForgotPassword";
import StudentResetPassword from "./Page/Student/ResetPassword/StudentResetPassword";

import TeacherRegistry from "./Page/Teacher/Register/TeacherRegistry";
import TeacherSignIn from "./Page/Teacher/SignIn/TeacherSignIn";
import TeacherForgotPassword from "./Page/Teacher/ForgotPassword/TeacherForgotPassword";
import TeacherResetPassword from "./Page/Teacher/ResetPassword/TeacherResetPassword";

interface AuthorizeUIProps {
  type: NonNullable<AuthType>;
}

export const AuthorizeUI: React.FC<AuthorizeUIProps> = ({ type, children }) => {
  if (type === "student") {
    return (
      <useStudentAuth.Provider>
        <StudentEntry>{children}</StudentEntry>
      </useStudentAuth.Provider>
    );
  }

  if (type === "teacher") {
    return (
      <useTeacherAuth.Provider>
        <TeacherEntry>{children}</TeacherEntry>
      </useTeacherAuth.Provider>
    );
  }

  throw new Error("AuthorizeUI must specify one of student or teacher types");
};

export default AuthorizeUI;

const AuthorizeUIWrapper: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <Loader />
      <Router history={history}>
        <Container>{children}</Container>
      </Router>
    </React.Fragment>
  );
};

const StudentEntry: React.FC = ({ children }) => {
  const { getUserProfile, setIsSignIn, isSignIn } =
    useStudentAuth.useContainer();

  useEffect(() => {
    const callback = async () => {
      try {
        await getUserProfile();
        setIsSignIn(true);
      } catch (error) {
        console.error(error);
        setIsSignIn(false);
      }
    };

    callback();
    // eslint-disable-next-line
  }, []);

  if (isTrue(isSignIn)) return <React.Fragment>{children}</React.Fragment>;

  return (
    <AuthorizeUIWrapper>
      <AuthHeader />
      <Route path="/" component={StudentRoute} />
    </AuthorizeUIWrapper>
  );
};

const TeacherEntry: React.FC = ({ children }) => {
  const { getUserProfile, setIsSignIn, isSignIn, userProfile, signOutHandler } =
    useTeacherAuth.useContainer();

  useEffect(() => {
    const callback = async () => {
      try {
        await getUserProfile();
      } catch (error) {
        console.error(error);
        setIsSignIn(false);
      }
    };

    callback();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isNotSet(userProfile)) return;
    if (userProfile?.profileStatus === "VERIFIED") {
      setIsSignIn(true);
    } else {
      setIsSignIn(false);
    }
    // eslint-disable-next-line
  }, [userProfile]);

  if (isTrue(isSignIn)) return <React.Fragment>{children}</React.Fragment>;

  return (
    <AuthorizeUIWrapper>
      <AuthHeader
        isSignedIn={isSet(userProfile)}
        signOutHandler={signOutHandler}
      />
      <Route path="/" component={TeacherRoute} />
    </AuthorizeUIWrapper>
  );
};

const StudentRoute: React.FC = () => {
  const { isSignIn } = useStudentAuth.useContainer();

  if (isNotSet(isSignIn)) return null;

  return (
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route path="/register" component={StudentRegistry} />
      <Route path="/sign_in" component={StudentSignIn} />
      <Route path="/forgot_password" component={StudentForgotPassword} />
      <Route path="/reset_password" component={StudentResetPassword} />
      <Route exact component={() => <Redirect to="/" />} />
    </Switch>
  );
};

const TeacherRoute: React.FC = () => {
  const history = useHistory();
  const { userProfile, isSignIn } = useTeacherAuth.useContainer();

  useEffect(() => {
    if (isNotSet(userProfile)) {
    } else {
      if (userProfile.profileStatus !== "VERIFIED") {
        history.push("/register");
      }
    }
    // eslint-disable-next-line
  }, [userProfile]);

  if (isNotSet(isSignIn)) return null;

  return (
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route path="/register" component={TeacherRegistry} />
      <Route path="/sign_in" component={TeacherSignIn} />
      <Route path="/forgot_password" component={TeacherForgotPassword} />
      <Route path="/reset_password" component={TeacherResetPassword} />
      <Route component={() => <Redirect to="/" />} />
    </Switch>
  );
};
