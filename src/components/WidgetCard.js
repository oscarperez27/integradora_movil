// src/components/WidgetCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const WidgetCard = ({ 
  title, 
  iconName, 
  iconLibrary = "MaterialCommunityIcons", 
  children, 
  onPress,
  variant = 'default',
  style
}) => {
  const renderIcon = () => {
    const iconProps = {
      name: iconName,
      size: 28,
      color: variant === 'default' ? '#D90429' : '#FFFFFF'
    };

    switch(iconLibrary) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      default:
        return <MaterialCommunityIcons {...iconProps} />;
    }
  };

  const cardVariantStyles = {
    default: {
      backgroundColor: '#FFFFFF',
      iconColor: '#D90429',
      textColor: '#1A1A1A'
    },
    primary: {
      backgroundColor: '#D90429',
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    secondary: {
      backgroundColor: '#3498db',
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    warning: {
      backgroundColor: '#f39c12',
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  };

  const currentVariant = cardVariantStyles[variant] || cardVariantStyles.default;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: currentVariant.backgroundColor },
        style
      ]} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.widgetTitle, { color: currentVariant.textColor }]}>
          {title}
        </Text>
        {renderIcon()}
      </View>
      <View style={styles.widgetContent}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    width: '48%',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 12,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 10,
  },
  widgetContent: {
    minHeight: 60,
  },
});

export default WidgetCard;