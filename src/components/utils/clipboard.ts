/**
 * Safe clipboard utility with multiple fallback methods
 * Handles clipboard permissions issues gracefully
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: Try modern Clipboard API
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Clipboard API failed, try fallback
  }

  // Method 2: Try using execCommand (older method)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return true;
    }
  } catch (err) {
    // execCommand also failed
  }

  // Method 3: All methods failed - return false
  return false;
}

/**
 * Copy text with user feedback
 * Shows alert with the text if copying fails
 */
export async function copyWithFeedback(
  text: string,
  successMessage: string = 'Copied to clipboard!',
  errorTitle: string = 'Copy Text'
): Promise<void> {
  const success = await copyToClipboard(text);
  
  if (success) {
    alert(successMessage);
  } else {
    // If copy failed, show the text in an alert so user can manually copy
    alert(`${errorTitle}\n\nPlease copy the text below:\n\n${text}`);
  }
}
