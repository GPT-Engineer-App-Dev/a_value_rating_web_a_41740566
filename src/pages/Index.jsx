import React, { useState } from "react";
import { Box, Button, Container, Flex, Heading, Input, List, ListItem, Stack, Text, VStack } from "@chakra-ui/react";
import { FaArrowRight, FaCheck, FaPlus, FaSearch } from "react-icons/fa";

const defaultValues = ["Honesty", "Integrity", "Respect", "Love", "Courage", "Compassion", "Gratitude", "Loyalty", "Fairness", "Freedom", "Responsibility", "Justice", "Wisdom", "Peace", "Balance"];

const Index = () => {
  const [stage, setStage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);
  const [results, setResults] = useState({});

  const filteredValues = searchTerm ? defaultValues.filter((value) => value.toLowerCase().includes(searchTerm.toLowerCase())) : defaultValues;

  const startRating = () => {
    if (selectedValues.length === 10) {
      setStage(1);
      generateComparisons(selectedValues);
    } else {
      alert("Please select 10 values to proceed.");
    }
  };

  const generateComparisons = (values) => {
    let pairs = [];
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        pairs.push([values[i], values[j]]);
      }
    }
    setComparisons(pairs);
  };

  const handleComparison = (winner) => {
    setResults((prev) => ({
      ...prev,
      [winner]: (prev[winner] || 0) + 1,
    }));

    if (currentComparisonIndex < comparisons.length - 1) {
      setCurrentComparisonIndex(currentComparisonIndex + 1);
    } else {
      setStage(2);
    }
  };

  const getRankingDisplay = () => {
    return Object.entries(results)
      .sort((a, b) => b[1] - a[1])
      .map((entry, index) => (
        <ListItem key={index}>
          <Text fontWeight={index === 0 ? "bold" : "normal"}>
            {index + 1}. {entry[0]} ({entry[1]} wins)
          </Text>
        </ListItem>
      ));
  };

  const handleValueSelection = (value) => {
    setSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value].slice(0, 10);
      }
    });
  };

  // Components for different stages
  const homePage = (
    <VStack spacing={6} align="stretch">
      <Heading>Welcome to the Value Rating App!</Heading>
      <Text>Discover and prioritize your personal values by rating them against each other.</Text>
      <Button colorScheme="blue" rightIcon={<FaArrowRight />} onClick={startRating}>
        Start Rating
      </Button>
    </VStack>
  );

  const valueSelectionPage = (
    <Stack spacing={4}>
      <Input placeholder="Search for values..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} rightElement={<FaSearch />} />
      <List spacing={2}>
        {filteredValues.map((value, index) => (
          <ListItem key={index}>
            <Button variant={selectedValues.includes(value) ? "solid" : "outline"} onClick={() => handleValueSelection(value)} isFullWidth rightIcon={selectedValues.includes(value) ? <FaCheck /> : <FaPlus />}>
              {value}
            </Button>
          </ListItem>
        ))}
      </List>
      <Button colorScheme="green" onClick={startRating}>
        Proceed to Compare
      </Button>
    </Stack>
  );

  const comparisonInterface = (
    <VStack spacing={6}>
      <Text>Which value is more important to you?</Text>
      <Stack direction="row" spacing={4}>
        <Button colorScheme="blue" onClick={() => handleComparison(comparisons[currentComparisonIndex][0])}>
          {comparisons[currentComparisonIndex][0]}
        </Button>
        <Text>or</Text>
        <Button colorScheme="teal" onClick={() => handleComparison(comparisons[currentComparisonIndex][1])}>
          {comparisons[currentComparisonIndex][1]}
        </Button>
      </Stack>
    </VStack>
  );

  const rankingDisplay = (
    <VStack spacing={4}>
      <Heading>Your Values Ranked</Heading>
      <List spacing={2}>{getRankingDisplay()}</List>
      <Button colorScheme="purple" onClick={() => setStage(0)}>
        Start Over
      </Button>
    </VStack>
  );

  return (
    <Container centerContent p={8}>
      <Flex direction="column" align="center" justify="center" minH="100vh">
        {stage === 0 && homePage}
        {stage === 1 && valueSelectionPage}
        {stage === 2 && comparisonInterface}
        {stage === 3 && rankingDisplay}
      </Flex>
    </Container>
  );
};

export default Index;
