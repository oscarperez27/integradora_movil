// src/components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  iconName, 
  iconSize = 20,
  iconColor = '#FFFFFF',
  loading = false,
  disabled = false,
  variant = 'primary'
}) => {
  // Estilos base para diferentes variantes
  const variantStyles = {
    primary: {
      backgroundColor: '#D90429',
    },
    secondary: {
      backgroundColor: '#3498db',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#D90429',
    },
    danger: {
      backgroundColor: '#e74c3c',
    },
    success: {
      backgroundColor: '#2ecc71',
    },
    disabled: {
      backgroundColor: '#95a5a6',
      opacity: 0.7,
    }
  };

  const textVariantStyles = {
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: '#FFFFFF',
    },
    outline: {
      color: '#D90429',
    },
    danger: {
      color: '#FFFFFF',
    },
    success: {
      color: '#FFFFFF',
    },
    disabled: {
      color: '#FFFFFF',
    }
  };

  const currentVariant = disabled ? 'disabled' : variant;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[currentVariant],
        style,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={iconColor}
              style={styles.icon}
            />
          )}
          <Text style={[
            styles.buttonText,
            textVariantStyles[currentVariant],
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CustomButton;