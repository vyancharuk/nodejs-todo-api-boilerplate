import * as path from 'path';

import logger from './logger';

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const lowerCaseFirstLetter = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

export const extractFileName = (input: string): string => {
  // Regular expression explanation:
  // - Look for a separator (e.g., -, --, :, etc.) possibly with spaces: [\-:]*\s*
  // - Capture a group of word characters (including camelCase and numbers): ([A-Za-z0-9]+)
  // - Followed by non-word characters or end of string: \W|$

  if (!input) {
    return '';
  }
  const regex = /[-:]*\s*([A-Za-z][A-Za-z0-9]*)\W*$/;
  const match = input.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return '';
};

export const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds));

export const buildTree = (paths: string[]): Record<string, any> => {
  const tree: Record<string, any> = {};

  for (const filePath of paths) {
    const parts = filePath.split(path.sep);
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        // If it's the last part, it's a file; else, it's a directory (object)
        current[part] = i === parts.length - 1 ? null : {};
      }
      current = current[part] || {};
    }
  }

  return tree;
};

export const printTree = (
  tree: Record<string, any>,
  prefix = '',
  isLast = true
) => {
  const entries = Object.keys(tree);
  entries.forEach((entry, index) => {
    const last = index === entries.length - 1;
    const connector = last ? '└─ ' : '├─ ';
    logger.info(prefix + connector + entry);

    const value = tree[entry];
    if (value && typeof value === 'object') {
      // For directories, print children with updated prefix
      const newPrefix = prefix + (last ? '   ' : '│  ');
      printTree(value, newPrefix, last);
    }
  });
};
