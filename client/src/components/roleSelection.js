import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './RoleSelection.module.css';

function RoleSelection() {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const name = searchParams.get('name');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch('http://localhost:9000/complete-registration', {
        email,
        displayName: name,
        role: selectedRole
      });

      // Store the token
      localStorage.setItem('token', response.data.token);

      // Redirect based on role
      navigate(selectedRole === 'student' ? '/student/home' : '/alumni/home');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Complete Your Registration</h2>
        <p className={styles.subtitle}>
          Welcome {name}! Please select your role to continue.
        </p>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="student"
                name="role"
                value="student"
                onChange={(e) => setSelectedRole(e.target.value)}
                className={styles.radioInput}
              />
              <label htmlFor="student" className={styles.radioLabel}>Student</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="alumnus"
                name="role"
                value="alumni"
                onChange={(e) => setSelectedRole(e.target.value)}
                className={styles.radioInput}
              />
              <label htmlFor="alumnus" className={styles.radioLabel}>Alumni</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedRole}
            className={styles.submitButton}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default RoleSelection;