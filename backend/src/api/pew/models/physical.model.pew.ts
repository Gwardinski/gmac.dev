import type { Bearing } from "./base.models.pew";
import { GRID_SIZE, type LevelTiles } from "./level.model.pew";

type CornerPosition = { x: number; y: number };
type PhysicalPositions = {
  x: number;
  y: number;
  size: number;
  topLeft: CornerPosition;
  topRight: CornerPosition;
  bottomLeft: CornerPosition;
  bottomRight: CornerPosition;
};

type CollisionEntry = {
  other: PhysicalModel;
  enterCallback?: (other: PhysicalModel) => void;
  exitCallback?: (other: PhysicalModel) => void;
};

export class PhysicalModel {
  constructor(
    public id: string,
    private x: number,
    private y: number,
    private size: number
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size;
    this.topLeft = { x, y };
    this.topRight = { x: x + size, y };
    this.bottomLeft = { x, y: y + size };
    this.bottomRight = { x: x + size, y: y + size };
    this.bearing = undefined;
  }

  private topLeft: CornerPosition;
  private topRight: CornerPosition;
  private bottomLeft: CornerPosition;
  private bottomRight: CornerPosition;
  public bearing: Bearing | undefined;
  // Map of other.id -> collision entry for tracking active collisions
  private collidingWith: Map<string, CollisionEntry> = new Map();

  public getPositions(): PhysicalPositions {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
      topLeft: this.topLeft,
      topRight: this.topRight,
      bottomLeft: this.bottomLeft,
      bottomRight: this.bottomRight,
    };
  }

  public setPositions(x: number, y: number, bearing?: Bearing) {
    this.x = x;
    this.y = y;
    this.topLeft = { x: this.x, y: this.y };
    this.topRight = { x: this.x + this.size, y: this.y };
    this.bottomLeft = { x: this.x, y: this.y + this.size };
    this.bottomRight = { x: this.x + this.size, y: this.y + this.size };
    this.bearing = bearing;
  }

  public onCollisionEnter(
    other: PhysicalModel,
    enterCallback?: (other: PhysicalModel) => void,
    exitCallback?: (other: PhysicalModel) => void
  ): boolean {
    // AABB (Axis-Aligned Bounding Box) collision detection
    const thisPos = this.getPositions();
    const otherPos = other.getPositions();

    const otherRight = otherPos.x + otherPos.size;
    const otherBottom = otherPos.y + otherPos.size;
    const thisRight = thisPos.x + thisPos.size;
    const thisBottom = thisPos.y + thisPos.size;

    const isColliding =
      otherPos.x < thisRight &&
      otherRight > thisPos.x &&
      otherPos.y < thisBottom &&
      otherBottom > thisPos.y;

    if (isColliding) {
      // Check if this collision is already being tracked
      const existingEntry = this.collidingWith.get(other.id);

      if (!existingEntry) {
        // New collision - track it and call enter callback
        this.collidingWith.set(other.id, {
          other,
          enterCallback,
          exitCallback,
        });
        enterCallback?.(other);
      } else {
        // Already tracking - update callbacks if provided
        if (enterCallback) {
          existingEntry.enterCallback = enterCallback;
        }
        if (exitCallback) {
          existingEntry.exitCallback = exitCallback;
        }
      }
    }

    return isColliding;
  }

  public onCollisionExit(
    other: PhysicalModel,
    exitCallback: (other: PhysicalModel) => void
  ): void {
    const entry = this.collidingWith.get(other.id);
    if (entry) {
      entry.exitCallback = exitCallback;
    }
  }

  public tickCollisionTracking(): void {
    const stillColliding: Map<string, CollisionEntry> = new Map();

    this.collidingWith.forEach((entry, otherId) => {
      const { other } = entry;

      // Check if still colliding
      const thisPos = this.getPositions();
      const otherPos = other.getPositions();

      const otherRight = otherPos.x + otherPos.size;
      const otherBottom = otherPos.y + otherPos.size;
      const thisRight = thisPos.x + thisPos.size;
      const thisBottom = thisPos.y + thisPos.size;

      const isStillColliding =
        otherPos.x < thisRight &&
        otherRight > thisPos.x &&
        otherPos.y < thisBottom &&
        otherBottom > thisPos.y;

      if (isStillColliding) {
        // Still colliding - keep tracking
        stillColliding.set(otherId, entry);
      } else {
        // Collision ended - call exit callback
        entry.exitCallback?.(other);
      }
    });

    this.collidingWith = stillColliding;
  }

  // walls use Level array so handled differently from "physical" objects
  public checkWallCollision(
    newX: number,
    newY: number,
    level: LevelTiles,
    size: number = this.size,
    checkBounds: boolean = false
  ): boolean {
    // Calculate the 4 corners of the bounding box
    const topLeft = { x: newX, y: newY };
    const topRight = { x: newX + size, y: newY };
    const bottomLeft = { x: newX, y: newY + size };
    const bottomRight = { x: newX + size, y: newY + size };

    // Convert to grid coordinates
    const topLeftGrid = {
      x: Math.floor(topLeft.x / GRID_SIZE),
      y: Math.floor(topLeft.y / GRID_SIZE),
    };
    const topRightGrid = {
      x: Math.floor(topRight.x / GRID_SIZE),
      y: Math.floor(topRight.y / GRID_SIZE),
    };
    const bottomLeftGrid = {
      x: Math.floor(bottomLeft.x / GRID_SIZE),
      y: Math.floor(bottomLeft.y / GRID_SIZE),
    };
    const bottomRightGrid = {
      x: Math.floor(bottomRight.x / GRID_SIZE),
      y: Math.floor(bottomRight.y / GRID_SIZE),
    };

    // Check outside level bounds
    if (checkBounds) {
      const maxRows = level.length;
      const maxCols = level[0]?.length || 0;
      if (
        topLeftGrid.y < 0 ||
        topLeftGrid.y >= maxRows ||
        topLeftGrid.x < 0 ||
        topLeftGrid.x >= maxCols ||
        topRightGrid.y < 0 ||
        topRightGrid.y >= maxRows ||
        topRightGrid.x < 0 ||
        topRightGrid.x >= maxCols ||
        bottomLeftGrid.y < 0 ||
        bottomLeftGrid.y >= maxRows ||
        bottomLeftGrid.x < 0 ||
        bottomLeftGrid.x >= maxCols ||
        bottomRightGrid.y < 0 ||
        bottomRightGrid.y >= maxRows ||
        bottomRightGrid.x < 0 ||
        bottomRightGrid.x >= maxCols
      ) {
        return true;
      }
    }

    // Check if any corner is in a wall tile (tile value 2)
    return (
      level[topLeftGrid.y]?.[topLeftGrid.x] === 2 ||
      level[topRightGrid.y]?.[topRightGrid.x] === 2 ||
      level[bottomLeftGrid.y]?.[bottomLeftGrid.x] === 2 ||
      level[bottomRightGrid.y]?.[bottomRightGrid.x] === 2
    );
  }
}
