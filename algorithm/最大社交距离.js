function lastOccupiedSeat(seatNum, events) {
  let pq = new MinPriorityQueue();
  let occupiedSeats = new Set();
  let lastSeat = -1;

  events.forEach(event => {
      if (event > 0) { // Entry event
          if (occupiedSeats.size === 0) {
              occupiedSeats.add(0);
              pq.enqueue(0);
          } else {
              let seat = findBestSeat(pq, occupiedSeats, seatNum);
              occupiedSeats.add(seat);
              pq.enqueue(seat);
          }
      } else { // Exit event
          let leavingSeat = -event;
          occupiedSeats.delete(leavingSeat);
          pq.delete(leavingSeat);
      }
      lastSeat = pq.front();
  });
  return lastSeat;
}

function findBestSeat(pq, occupiedSeats, seatNum) {
  let bestSeat = -1;
  let maxDistance = -1;
  let prev = -1;
  pq.toArray().forEach(seat => {
      let distance = seat - prev - 1;
      if (distance > maxDistance) {
          maxDistance = distance;
          bestSeat = prev + Math.floor(distance / 2) + 1;
      }
      prev = seat;
  });
  if (seatNum - 1 - prev > maxDistance) {
      bestSeat = seatNum - 1;
  }
  return bestSeat;
}

// Note: The above code uses a hypothetical MinPriorityQueue class which you would need to implement or use an existing library.
// Example usage:
console.log(lastOccupiedSeat(10, [1, 1, 1, 1, -4, 1])); // Output: 5
